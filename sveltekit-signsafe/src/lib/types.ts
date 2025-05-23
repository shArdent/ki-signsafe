export type User = {
    id: string,
    balance: number,
    created_at: string,
    name: string,
    public_key: string
}

export type HistoryItem = {
    id: number;
    user_id: string;
    to_user_id: string | null;
    type: 'topup' | 'transfer' | 'receive';
    amount: number;
    timestamp: string;
    balance_after: number;
    reciever_name: string;
    sender_name: string;
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; 
