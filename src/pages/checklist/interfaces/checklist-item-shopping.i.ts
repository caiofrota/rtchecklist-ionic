import { IChecklistItem } from '../';

/**
 * Checklist item shopping interface.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
export interface IChecklistItemShopping extends IChecklistItem {
    value?: number;
    quantity?: number;
}
