/**
 * Checklist interface.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
export interface IChecklistItem {
    $ref?: any;
    $key?: any;
    name: string;
    checked: boolean;
}
