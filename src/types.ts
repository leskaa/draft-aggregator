export interface OpenDotaHeroStats {
    id: number;
    name: string;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    roles: string[];
    img: string;
    icon: string;
    base_health: number;
    base_health_regen: number;
    base_mana: number;
    base_mana_regen: number;
    base_armor: number;
    base_mr: number;
    base_attack_min: number;
    base_attack_max: number;
    base_str: number;
    base_agi: number;
    base_int: number;
    str_gain: number;
    agi_gain: number;
    int_gain: number;
    attack_range: number;
    projectile_speed: number;
    attack_rate: number;
    move_speed: number;
    turn_rate: number;
    cm_enabled: boolean;
    legs: number;
    turbo_picks: number;
    turbo_wins: number;
    pro_ban: number;
    pro_win: number;
    pro_pick: number;
    '1_pick': number;
    '1_win': number;
    '2_pick': number;
    '2_win': number;
    '3_pick': number;
    '3_win': number;
    '4_pick': number;
    '4_win': number;
    '5_pick': number;
    '5_win': number;
    '6_pick': number;
    '6_win': number;
    '7_pick': number;
    '7_win': number;
    '8_pick': number;
    '8_win': number;
    null_pick: number;
    null_win: number;
}

export interface Option {
    heroId: number;
    localized_name: string;
    short_name: string;
    base_winrate: number;
}

export interface ProPickRate {
    heroId: number;
    picks: number;
    bans: number;
}

export interface PubWinRate {
    heroId: number;
    winrate: number;
}

export interface MatchupSet {
    heroId: number;
    team: number;
    matchups: Matchup[];
}

// data { heroStats { matchUp[] } }
export interface StratzMatchupResponse {
    heroId: number;
    with: StratzDryad[];
    vs: StratzDryad[];
}

export interface StratzDryad {
    heroId2: number;
    matchCount: number;
    winCount: number;
}

export interface Matchup {
    heroId: number;
    matchCount: number;
    winCount: number;
    winrate: number;
    pickRate: number;
    banRate: number;
}

export interface RecommendationReason {
    heroId: number;
    name: string;
    team: string; // TODO: Better name for this
    winrate: number;
}

export interface Recommendation {
    heroId: number;
    name: string;
    short_name: string;
    winrate: number;
    reasonList: RecommendationReason[];
}