export interface MoveRequest {
	sourceId: string;
	targetId: string;
	where: 'PREV' | 'NEXT';
}

export type PropsWithStoreId<T = unknown> = T & { storeId: string };
