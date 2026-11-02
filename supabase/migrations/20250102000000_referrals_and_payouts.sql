-- ============================================================================
-- KAMBOH PLUS: REFERRAL & AFFILIATE COMMISSION SYSTEM MIGRATION
-- ============================================================================

-- 1. Create table for tracking referred users
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_email_masked TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'signed_up' CHECK (status IN ('signed_up', 'active_pro_monthly', 'active_pro_yearly', 'churned')),
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    total_commission_generated NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_referred_user UNIQUE (referred_user_id)
);

-- 2. Create table for affiliate withdrawal / payout requests
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 20.00),
    method TEXT NOT NULL CHECK (method IN ('USDT_TRC20', 'USDT_BEP20', 'BINANCE_PAY', 'BANK_TRANSFER', 'JAZZCASH_EASYPAISA')),
    payout_details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'rejected')),
    tx_hash_or_ref TEXT,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: Referrals
-- Users can read their own referrals
CREATE POLICY "Users can view own referrals"
    ON public.referrals
    FOR SELECT
    USING (auth.uid() = referrer_id);

-- Admins can view and manage all referrals
CREATE POLICY "Admins full access to referrals"
    ON public.referrals
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. RLS Policies: Payout Requests
-- Users can view and create their own payout requests
CREATE POLICY "Users can view own payouts"
    ON public.payout_requests
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can submit payout requests"
    ON public.payout_requests
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can view and update all payout requests
CREATE POLICY "Admins full access to payouts"
    ON public.payout_requests
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. Trigger to credit commission when a referred user upgrades to Pro
CREATE OR REPLACE FUNCTION public.handle_referral_subscription_upgrade()
RETURNS TRIGGER AS $$
DECLARE
    v_referrer_id UUID;
    v_commission NUMERIC(10, 2);
BEGIN
    -- Check if subscriber was referred by someone
    SELECT referrer_id INTO v_referrer_id
    FROM public.referrals
    WHERE referred_user_id = NEW.user_id;

    IF v_referrer_id IS NOT NULL THEN
        -- 30% commission: $2.70 on Monthly ($9), $23.70 on Yearly ($79)
        IF NEW.variant_id LIKE '%yearly%' OR NEW.plan = 'pro' THEN
            v_commission := 23.70;
            UPDATE public.referrals
            SET status = 'active_pro_yearly',
                plan = 'pro',
                total_commission_generated = total_commission_generated + v_commission,
                updated_at = NOW()
            WHERE referred_user_id = NEW.user_id;
        ELSE
            v_commission := 2.70;
            UPDATE public.referrals
            SET status = 'active_pro_monthly',
                plan = 'pro',
                total_commission_generated = total_commission_generated + v_commission,
                updated_at = NOW()
            WHERE referred_user_id = NEW.user_id;
        END IF;

        -- Create notification for the referrer
        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES (
            v_referrer_id,
            '💰 Affiliate Commission Earned!',
            'Your referral upgraded to Pro! You earned $' || v_commission::TEXT || ' commission.',
            'billing'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_subscription_credited_to_referral
    AFTER INSERT OR UPDATE ON public.subscriptions
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION public.handle_referral_subscription_upgrade();
