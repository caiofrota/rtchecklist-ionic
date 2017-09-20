import { IChecklistItem } from '../';

/**
 * Checklist item account interface.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
export interface IChecklistItemAccount extends IChecklistItem {
    dueDate?: Date;
    value?: number;
    moviment: EChecklistItemAccountMoviment;
}

/**
 * Enumeration that indicates the type of movement.
 */
export enum EChecklistItemAccountMoviment {
    GAIN = 0,
    EXPENSE = 1,
}
