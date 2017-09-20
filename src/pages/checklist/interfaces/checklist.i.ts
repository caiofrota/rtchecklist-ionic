import { IChecklistItem } from '../';

/**
 * Checklist interface.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
export interface IChecklist {
    $ref?: any;
    type?: EChecklistType;
    name: string;
    items: Array<IChecklistItem>;
    permanent: boolean;
    created_on: number;
    updated_on: number;
    last_access_on: number;
}

export enum EChecklistType {
    DEFAULT = 0,
    SHOPPING = 1,
    COMMITMENT = 2,
    ACCOUNTS = 3,
}
