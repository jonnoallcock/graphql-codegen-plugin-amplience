import type {
  ConstDirectiveNode,
  DefinitionNode,
  DirectiveNode,
  FieldDefinitionNode,
  NamedTypeNode,
  ObjectTypeDefinitionNode,
  ObjectValueNode,
  TypeDefinitionNode,
  TypeNode,
  ValueNode,
} from "graphql";

export const hasDirective = (
  symbol: FieldDefinitionNode | TypeDefinitionNode,
  name: string,
): boolean | undefined => symbol.directives?.some((t) => t.name.value === name);

export const maybeDirective = (
  symbol: FieldDefinitionNode | TypeDefinitionNode,
  name: string,
): ConstDirectiveNode | undefined =>
  symbol.directives?.find((t) => t.name.value === name);

export const maybeDirectiveValue = <T extends ValueNode>(
  directive: DirectiveNode,
  argument: string,
): T | undefined =>
  directive?.arguments?.find((t) => t.name.value === argument)?.value as
    | T
    | undefined;

export const maybeFieldValue = <T extends ValueNode>(
  node: ObjectValueNode,
  field: string,
): T | undefined =>
  node.fields.find((f) => f.name.value === field)?.value as T | undefined;

export const isObjectTypeDefinitionNode = (
  definitionNode: DefinitionNode,
): definitionNode is ObjectTypeDefinitionNode =>
  definitionNode.kind === "ObjectTypeDefinition";

export const typeName = (type: TypeNode): string => namedType(type).name.value;

export const namedType = (type: TypeNode): NamedTypeNode => {
  switch (type.kind) {
    case "ListType":
      return namedType(type.type);
    case "NamedType":
      return type;
    case "NonNullType":
      return namedType(type.type);
    default:
      throw new Error(type.kind);
  }
};

export const switchArray = <T>(
  type: TypeNode,
  {
    ifArray,
    other,
  }: { ifArray: (subType: TypeNode) => T; other: (type: TypeNode) => T },
): T => {
  if (type.kind === "ListType") {
    return ifArray(type.type);
  }

  if (type.kind === "NonNullType" && type.type.kind === "ListType") {
    return ifArray(type.type.type);
  }

  return other(type);
};
