﻿import * as ts from "typescript";
import * as fillClassFuncs from "./../../manipulation/fillClassFunctions";
import * as getStructureFuncs from "./../../manipulation/getStructureFunctions";
import {MethodDeclarationOverloadStructure, MethodDeclarationStructure} from "./../../structures";
import {callBaseFill} from "./../callBaseFill";
import {Node} from "./../common";
import {PropertyNamedNode, StaticableNode, AsyncableNode, GeneratorableNode, ScopedNode, DecoratableNode, BodyableNode} from "./../base";
import {FunctionLikeDeclaration, OverloadableNode, insertOverloads} from "./../function";
import {AbstractableNode} from "./base";

export const MethodDeclarationBase = OverloadableNode(DecoratableNode(AbstractableNode(ScopedNode(StaticableNode(AsyncableNode(GeneratorableNode(
    FunctionLikeDeclaration(BodyableNode(PropertyNamedNode(Node)))
)))))));
export class MethodDeclaration extends MethodDeclarationBase<ts.MethodDeclaration> {
    /**
     * Fills the node from a structure.
     * @param structure - Structure to fill.
     */
    fill(structure: Partial<MethodDeclarationStructure>) {
        callBaseFill(MethodDeclarationBase.prototype, this, structure);

        if (structure.overloads != null && structure.overloads.length > 0)
            this.addOverloads(structure.overloads);

        return this;
    }

    /**
     * Add a method overload.
     * @param structure - Structure to add.
     */
    addOverload(structure: MethodDeclarationOverloadStructure) {
        return this.addOverloads([structure])[0];
    }

    /**
     * Add method overloads.
     * @param structures - Structures to add.
     */
    addOverloads(structures: MethodDeclarationOverloadStructure[]) {
        return this.insertOverloads(this.getOverloads().length, structures);
    }

    /**
     * Inserts a method overload.
     * @param index - Index to insert at.
     * @param structure - Structures to insert.
     */
    insertOverload(index: number, structure: MethodDeclarationOverloadStructure) {
        return this.insertOverloads(index, [structure])[0];
    }

    /**
     * Inserts method overloads.
     * @param index - Index to insert at.
     * @param structures - Structures to insert.
     */
    insertOverloads(index: number, structures: MethodDeclarationOverloadStructure[]) {
        const thisName = this.getName();
        const indentationText = this.getIndentationText();
        const childCodes = structures.map(structure => `${indentationText}${thisName}();`);

        return insertOverloads({
            node: this,
            index,
            structures,
            childCodes,
            getThisStructure: getStructureFuncs.fromMethodDeclarationOverload,
            fillNodeFromStructure: fillClassFuncs.fillMethodDeclarationOverloadFromStructure,
            expectedSyntaxKind: ts.SyntaxKind.MethodDeclaration
        });
    }
}
