import { ISimpleType, TypeFlags, Type, IType } from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, typecheck } from "../type-checker"
import { isPrimitive, fail } from "../../utils"
import { Node } from "../../core"
import { string as stringType, number as numberType } from "../primitives"
import { Late } from "./late"

export class IdentifierType<T> extends Type<T, T> {
    readonly flags = TypeFlags.Identifier

    constructor(
        public readonly identifierType: IType<T, T>,
    ) {
        super(`identifier(${identifierType.name})`)
    }

    // TODO
    // instantiate(parent: Node, subpath: string, environment: any, snapshot: T): Node {
    //     typecheck(this.identifierType, snapshot)
    //     // TODO: assert parent.type is a model type!
    //     // TODO: return IdentifierNode
    //     // TODO: check uniques in parent
    //     return new Node(this, parent, subpath, environment, snapshot)
    // }

    describe() {
        return `identifier(${this.identifierType})`
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        return typeCheckSuccess()
        // TODO:
    }
}

// TODO: properly turn this into a factory, that reuses `types.string`?
// See: https://github.com/mobxjs/mobx-state-tree/pull/65#issuecomment-289603441
// todo: change to const `types.identifier`!
export function identifier<T>(baseType: IType<T, T>): T;
export function identifier(): string;
export function identifier(baseType: IType<any, any> = stringType): any {
    // TODO: MWE: this seems contrived, let's not assert anything and support unions, refinements etc.
    if (baseType !== stringType && baseType !== numberType)
        fail(`Only 'types.number' and 'types.string' are acceptable as type specification for identifiers`)
    return new IdentifierType(baseType)
}

export function isIdentifierType(type: any): type is IdentifierType<any> {
    return (!(type instanceof Late)) && // yikes
        (type.flags & (TypeFlags.Identifier)) > 0
}
