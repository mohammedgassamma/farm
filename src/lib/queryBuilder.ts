import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Query,
  WhereFilterOp,
  OrderByDirection,
  DocumentData,
  Firestore,
} from "firebase/firestore";

interface QueryFilter {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

interface QueryOrder {
  field: string;
  direction?: OrderByDirection;
}

interface QueryOptions {
  filters?: QueryFilter[];
  orderBy?: QueryOrder[];
  limit?: number;
  startAfter?: any;
}

/**
 * Builds a Firestore query from an options object
 * @param db - Firestore instance
 * @param collectionPath - Path to the collection
 * @param options - Query options including filters, ordering, and pagination
 * @returns Constructed Firestore query
 */
export function buildQuery({
  db,
  collectionPath,
  options,
}: {
  db: Firestore;
  collectionPath: string;
  options: QueryOptions;
}): Query<DocumentData> {
  const coll = collection(db, collectionPath);
  const constraints = [];

  // Add where clauses
  if (options.filters && options.filters.length > 0) {
    options.filters.forEach((filter) => {
      constraints.push(where(filter.field, filter.operator, filter.value));
    });
  }

  // Add orderBy clauses
  if (options.orderBy && options.orderBy.length > 0) {
    options.orderBy.forEach((order) => {
      constraints.push(orderBy(order.field, order.direction || "asc"));
    });
  }

  // Add limit
  if (options.limit) {
    constraints.push(limit(options.limit));
  }

  // Add pagination cursor
  if (options.startAfter) {
    constraints.push(startAfter(options.startAfter));
  }

  return query(coll, ...constraints);
}
