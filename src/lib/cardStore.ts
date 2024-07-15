import { writable } from 'svelte/store';

interface CardDetails {
    category: string;
    amount: number;
    quantity: number;
}

const createCardStore = () => {
    const { subscribe, set, update } = writable<CardDetails>({
        category: '',
        amount: 0,
        quantity: 1
    });

    return {
        subscribe,
        setDetails: (details: CardDetails) => set(details),
        updateQuantity: (newQuantity: number) => update(details => ({
            ...details,
            quantity: newQuantity,
            amount: details.amount * newQuantity
        }))
    };
};

export const cardStore = createCardStore();