import { parseCode } from './code-analyzer';
import { createMethodAndArguments } from './controller/elementsTableController';
import { symbolicSubstitution } from './controller/symbolicSubstituter';
import toEvalParsedMethod from './controller/evaluator';

export const makeTestableFunction = (code) => {
    const parsedCode = parseCode(code);
    return createMethodAndArguments(parsedCode);
};

export const makeTestableSubstitutedFunction = (code) => {
    const testableFunction = makeTestableFunction(code);
    return symbolicSubstitution(testableFunction);
};

export const makeTestableEvaluatedFunction = (code, parameters) => {
    const testableSubtitutedFunction = makeTestableSubstitutedFunction(code);
    return toEvalParsedMethod(testableSubtitutedFunction, parameters);
};

const createExpectedObject = (objectProperties) =>
{
    const { lineType, lineName='', lineCondition='', lineValue='', lineBody=[], alternate, conditionColor } = objectProperties;
    return { lineType, lineName, lineCondition, lineValue, lineBody,alternate, conditionColor};
};

export const createExpectedFunction = (lineName, parameters=[], lineBody) => {
    const expectedFunction = createExpectedObject({ lineType: 'functionDeclaration', lineName, lineBody });
    expectedFunction.parameters = parameters;
    return expectedFunction;
};

export const createExpectedReturnStatement = (lineValue) => 
    createExpectedObject({ lineType: 'returnStatement', lineValue });

export const createExpectedIfStatement = (lineCondition, lineBody, alternate, conditionColor) => 
    createExpectedObject({ lineType: 'ifStatement', lineCondition, lineBody, alternate, conditionColor });

export const createExpectedElseIfStatement = (lineCondition, lineBody, alternate, conditionColor) => 
    createExpectedObject({ lineType: 'elseIfStatement', lineCondition, lineBody, alternate, conditionColor });

export const createExpectedElseStatement = (lineBody) =>  
    createExpectedObject({ lineType: 'elseStatement', lineBody });

export const createExpectedWhileStatement = (lineCondition, lineBody) => 
    createExpectedObject({ lineType: 'whileStatement', lineCondition, lineBody });

export const createExpectedAssignmentStatement = (lineName,lineValue) => 
    createExpectedObject({ lineType: 'assignmentExpression', lineName, lineValue });
