import FunctionLine from '../model/FunctionLine';
import ParameterTable from '../model/ParameterTable';
import AssignmentLine from '../model/AssignmentLine';
import ReturnLine from '../model/ReturnLine';
import WhileLine from '../model/WhileLine';
import IfLine from '../model/IfLine';
import ElseIfLine from '../model/ElseIfLine';
import ElseLine from '../model/ElseLine';

let functionTableModel;
let ParameterTableModel;

const returnStatementTabler = (returnStatement) => {
    const returnLine = new ReturnLine(returnStatement);
    return returnLine;
};

const expressionStatementTabler = (expressionStatement) => {
    const { expression } = expressionStatement;
    const assignmentLine = new AssignmentLine(expression);
    return assignmentLine;
};

const whileStatementTabler = (whileStatement) => {
    const whileBody = expressionBodyTabler(whileStatement.body);
    const whileLine = new WhileLine(whileStatement, whileBody);
    return whileLine;
}

const alternateTabler = (alternate) => {
    if(!alternate) return;
    const { type } = alternate;
    if(type === 'IfStatement'){
        return ifStatementTabler(alternate, true);
    }
    const alternateBody = expressionBodyTabler(alternate);
    const elseLine = new ElseLine(alternateBody);
    return elseLine;
};

const ifStatementTabler = (ifStatement, isElse = false) => {
    const { alternate, consequent} = ifStatement;
    const ifBody = expressionBodyTabler(consequent);
    const ifAlternate =  alternateTabler(alternate);
    const ifLine = isElse ? new ElseIfLine(ifStatement, ifBody, ifAlternate) : new IfLine(ifStatement, ifBody, ifAlternate);
    return ifLine;
};

const variableDeclaratorTabler = (declarationsContainer) => {
    const { declarations } = declarationsContainer;
    const assignments = declarations.map(declaration => new AssignmentLine({ left: declaration.id,  right: declarations.init}));
    return assignments;
};

const functionParametersTabler = (parameter) => {
    ParameterTableModel.addParameter(parameter.name);
};

const functionTabler = (functionObject) => {
    const { params, body } = functionObject;
    params.forEach(param => functionParametersTabler(param));
    const functionBody = expressionBodyTabler(body);
    functionTableModel = new FunctionLine(functionObject, functionBody);
};

const expressionBodyTabler = (objectStatements) => {
    const { type, body } = objectStatements;
    if(type !== 'BlockStatement'){
        const newElement = elementTabler(objectStatements);
        return newElement.length? newElement : [ newElement ];
    }

    const elementsBody = [];
    for(let i = 0; i < body.length; i++){
        const newElement = elementTabler(body[i]);
        newElement.length ? newElement.forEach(element => elementsBody.push(element)) : elementTabler(newElement);
    }
    return elementsBody.filter((element) => element != null && element!= undefined);
};

const tableTypesMethods = {
    FunctionDeclaration: functionTabler,
    VariableDeclaration: variableDeclaratorTabler,
    ExpressionStatement: expressionStatementTabler,
    WhileStatement: whileStatementTabler,
    IfStatement: ifStatementTabler,
    ReturnStatement: returnStatementTabler
};

const elementTabler = (object) =>
{
    const { type } = object;
    let methodType = tableTypesMethods[type];
    return methodType ? methodType(object) : null;
};

const bodyTabler = (parsedCodeBody) => parsedCodeBody.length > 0 ? elementTabler(parsedCodeBody[0]) : null

export const createMethodAndArguments = (parsedCode) => {
    const { body } = parsedCode;
    ParameterTableModel = new ParameterTable();
    bodyTabler(body);
    return { method: functionTableModel, parameters: ParameterTableModel };
};