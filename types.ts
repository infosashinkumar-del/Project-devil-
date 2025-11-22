export interface User {
    id: string;
    name: string;
    email: string;
    mobile: string;
    referral_code: number;
    is_active: boolean;
    current_level_id: number;
    sponsor_id: string;
    direct_referrals_count: number;
    team_size: number;
    upi_id?: string;
    wallet_address?: string;
    t_pin?: string;
    created_at: string;
    joining_date: string;
    levels?: {
        name: string;
        id: number;
    };
}

export interface IncomeSummary {
    all_time_income: number;
    all_time_paid: number;
    today_income: number;
    last_7_day_income: number;
    last_30_day_income: number;
    direct_income: number;
    team_income: number;
    passive_income: number;
    excellence_income?: number;
    fund_received?: number;
    top_ten_income?: number;
}

export interface EarningRecord {
    id: number;
    amount: number;
    type: string;
    created_at: string;
    source_user?: {
        name: string;
    };
}

export interface LeaderboardUser {
    name: string;
    real_income: number;
    team_size: number;
}
