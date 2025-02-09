/*
 * Server Model Validator
 * HP --> Should start with HPE, Regex is ^HPE\s([a-z]|[A-Z]|[0-9])(\s|[a-z]|[A-Z]|[0-9])*
 * Cisco ---> Should start with UCS, Regex is similar to above
 * Dell ---> Should start with PowerEdge, Regex is similar to above
 */

import { AbstractControl } from "@angular/forms";

export function ServerModelValidator(control: AbstractControl): { [key: string] : boolean} | null {

    /* Prepare the Regexes */
    const regexSuffix = '\\s([a-z]|[A-Z]|[0-9])(\s|[a-z]|[A-Z]|[0-9])*';
    const HP_Regex = new RegExp('^HPE' + regexSuffix);
    const Cisco_Regex = new RegExp('^UCS' + regexSuffix);
    const Dell_Regex = new RegExp('^PowerEdge' + regexSuffix);

    /* Get Server Make and Model */
    const serverMakeControl = control.get('serverDetails')?.get('serverMake');
    var serverMakeValue = serverMakeControl?.value;
    const serverModelControl = control.get('serverDetails')?.get('serverModel');
    var serverModelValue = serverModelControl?.value;

    /* If form controls are not yet filled, don't show errors */
    if (serverMakeControl?.pristine || serverModelControl?.pristine) {
        return null;
    }

    /* Make Regex comparisons
     * This is a soft guardrail and should not block unknown configurations
     * Hence, default for unexpected situations is a pass
     */
    var isRegexMatch = true;
    if (serverMakeValue !== null) {
        if (serverMakeValue === 'HP') {
            isRegexMatch = HP_Regex.test(serverModelValue);
        } else if (serverMakeValue === 'Cisco') {
            isRegexMatch = Cisco_Regex.test(serverModelValue);
        } else if (serverMakeValue === 'Dell') {
            isRegexMatch = Dell_Regex.test(serverModelValue);
        }
    }

    /* Return misMatch value */
    if(isRegexMatch === true) {
        return null;
    } else {
        return { 'misMatch': true };
    }
}