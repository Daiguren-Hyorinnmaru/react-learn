export interface ParameterProperty {
    name: string;
    dataType: string;
    required: boolean;
    defaultValue: any;
    description: string;
}

export interface ParameterAction {
    code: string;
    label: string;
    description: string;
}

export interface ParameterCondition {
    code: string;
    label: string;
    description: string;
}

export interface ParameterType {
    code: string;
    label: string;
    description: string;
    properties: ParameterProperty[];
    supportedActions: ParameterAction[];
    supportedConditions: ParameterCondition[];
}

export interface Rule {
    action: string;
    dependsOn: string;
    when: string;
}

export type ParameterInstance = {
    id: string;
    name: string;
    typeCode: string;
    propertyValues: Record<string, any>;
    rules: Rule[];
};

export interface NamedParameterWithSeparator {
    name: string;
    separator: string;
}
