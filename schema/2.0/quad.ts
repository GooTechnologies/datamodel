/// <reference path="gooobject.ts"/>

interface quad extends GooObject {
	materialRef?: MaterialRef;
}
// REVIEW quad is not a GooObject, it's a component. Put in entity.ts
// Also I think materialRef should be mandatory