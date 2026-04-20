// services/BaseFirebaseService.ts
import { authFirebase } from "@/firebaseAuth";
import { db } from "@/firebaseConfig";
import { buildQuery } from "@/lib/queryBuilder";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  getCountFromServer,
  sum,
  getAggregateFromServer,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  setDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

export class BaseService<T extends { id?: string }> {
  protected collectionName: string;

  constructor(collectionName?: string) {
    this.collectionName = collectionName || "";
  }

  async create(data: Omit<T, "id">): Promise<string> {
    const userId = authFirebase.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }
  async setDoc(data: Omit<T, "id">, id: string): Promise<string> {
    const userId = authFirebase.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    await setDoc(doc(db, this.collectionName, id), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  }
  async createOrUpdate({
    data,
    id,
  }: {
    data: Omit<T, "id">;
    id: string;
  }): Promise<void> {
    const userId = authFirebase.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    await setDoc(doc(db, this.collectionName, id), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async getAll(): Promise<T[]> {
    const snapshot = await getDocs(collection(db, this.collectionName));
    return snapshot.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({ id: snap.id, ...snap.data() } as T));
  }
  async getAllByCollectionName({ cName }: { cName: string }): Promise<T[]> {
    const snapshot = await getDocs(collection(db, cName));
    return snapshot.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({ id: snap.id, ...snap.data() } as T));
  }

  async findBy(filter?: { field: keyof T; value: any }): Promise<T[]> {
    const colRef = collection(db, this.collectionName);

    const q = filter
      ? query(colRef, where(filter.field as string, "==", filter.value))
      : colRef;

    const snapshot = await getDocs(q);
    return snapshot.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({ id: snap.id, ...snap.data() } as T));
  }

  async findByIdWithCollectionName({
    id,
    cName,
  }: {
    id: string;
    cName: string;
  }): Promise<T | null> {
    const docRef = doc(db, cName, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists()
      ? ({ id: snapshot.id, ...snapshot.data() } as T)
      : null;
  }

  async findByUserId(): Promise<T[]> {
    const userId = authFirebase.currentUser?.uid;

    if (!userId) {
      return [];
    }

    const colRef = collection(db, this.collectionName);

    const q = userId ? query(colRef, where("userId", "==", userId)) : colRef;

    const snapshot = await getDocs(q);
    return snapshot.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({ id: snap.id, ...snap.data() } as T));
  }
  async getBySpecifiedUserId(userId: string): Promise<T[]> {
    if (!userId) {
      return [];
    }

    const colRef = collection(db, this.collectionName);

    const q = userId ? query(colRef, where("userId", "==", userId)) : colRef;

    const snapshot = await getDocs(q);
    return snapshot.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({ id: snap.id, ...snap.data() } as T));
  }

  async findByUserIdWithCollectionName({
    cName,
    fallback = [],
  }: {
    cName: string;
    fallback?: any;
  }): Promise<T[]> {
    const userId = authFirebase.currentUser?.uid;

    if (!userId) {
      return [];
    }

    const colRef = collection(db, cName);

    const q = userId ? query(colRef, where("userId", "==", userId)) : colRef;

    const snapshot = await getDocs(q);
    return (
      snapshot.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({ id: snap.id, ...snap.data() } as T)) ??
      fallback
    );
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists()
      ? ({ id: snapshot.id, ...snapshot.data() } as T)
      : null;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(
      docRef as any,
      { ...data, updatedAt: serverTimestamp() } as any
    );
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async getSum({
    filters,
    includeUserId,
  }: {
    filters: Record<string, any>;
    includeUserId?: boolean;
  }): Promise<Record<string, any>> {
    try {
      const coll = collection(db, this.collectionName);
      const userId = authFirebase.currentUser?.uid;

      const q = includeUserId
        ? query(coll, where("userId", "==", userId))
        : coll;

      const reducedFilters = Object.keys(filters).reduce((acc, curr) => {
        const value = filters[curr];
        acc[curr] = sum(value);
        return acc;
      }, {} as any);

      const snapshot = await getAggregateFromServer(q, {
        ...reducedFilters,
      });

      return snapshot.data();
    } catch (e) {
      return {};
    }
  }

  async getCount({
    options,
    includeUserId,
  }: {
    options: Record<string, any>;
    includeUserId?: boolean;
  }): Promise<number> {
    const q = buildQuery({ db, collectionPath: this.collectionName, options });
    const userId = authFirebase.currentUser?.uid;

    const qWithUserId = includeUserId
      ? query(q, where("userId", "==", userId))
      : q;

    const snapshot = await getCountFromServer(qWithUserId);
    return snapshot.data().count;
  }

  async findByUserIdWithPagination({
    fallback = [],
    pageSize = 10,
    lastDoc = null,
  }: {
    fallback?: any;
    pageSize?: number;
    lastDoc?: any;
  } = {}): Promise<{ data: T[]; lastDoc: any; hasMore: boolean }> {
    const userId = authFirebase.currentUser?.uid;

    if (!userId) {
      return { data: [], lastDoc: null, hasMore: false };
    }

    const colRef = collection(db, this.collectionName);

    // Build query with pagination
    let q = query(
      colRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize + 1)
    );

    if (lastDoc) {
      q = query(
        colRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);

    const hasMore = snapshot.docs.length > pageSize;
    const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
    const data = docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({ id: snap.id, ...snap.data() } as T));
    const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : null;

    return {
      data: data.length > 0 ? data : fallback,
      lastDoc: newLastDoc,
      hasMore,
    };
  }

  // Get all documents by userId from dynamic collectionName
  async findByUserIdWithCollectionNameWithPagination({
    cName,
    fallback = [],
    pageSize = 10,
    lastDoc = null,
  }: {
    cName: string;
    fallback?: any;
    pageSize?: number;
    lastDoc?: any;
  }): Promise<{ data: T[]; lastDoc: any; hasMore: boolean }> {
    try {
      const userId = authFirebase.currentUser?.uid;

      if (!userId) {
        return { data: [], lastDoc: null, hasMore: false };
      }

      const colRef = collection(db, cName);

      let q = query(
        colRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(pageSize + 1)
      );

      if (lastDoc) {
        q = query(
          colRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(pageSize + 1)
        );
      }

      const snapshot = await getDocs(q);

      const hasMore = snapshot.docs.length > pageSize;
      const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
      const data = docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({ id: snap.id, ...snap.data() } as T));
      const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : null;

      return {
        data: data.length > 0 ? data : fallback,
        lastDoc: newLastDoc,
        hasMore,
      };
    } catch (e) {
      return {
        data: [],
        lastDoc: null,
        hasMore: false,
      };
    }
  }

  // Get ALL documents from collection (no userId filter)
  async getAllByCollectionNameWithPagination({
    cName,
    fallback = [],
    pageSize = 10,
    lastDoc = null,
  }: {
    cName: string;
    fallback?: any;
    pageSize?: number;
    lastDoc?: any;
  }): Promise<{ data: T[]; lastDoc: any; hasMore: boolean }> {
    const colRef = collection(db, cName);

    let q = query(colRef, orderBy("createdAt", "desc"), limit(pageSize + 1));

    if (lastDoc) {
      q = query(
        colRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);

    const hasMore = snapshot.docs.length > pageSize;
    const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
    const data = docs.map((snap: QueryDocumentSnapshot<DocumentData>) => ({ id: snap.id, ...snap.data() } as T));
    const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : null;

    return {
      data: data.length > 0 ? data : fallback,
      lastDoc: newLastDoc,
      hasMore,
    };
  }
}

// const simpleQuery = buildQuery(db, 'users', {
//   filters: [
//     { field: 'state', operator: '==', value: 'CA' }
//   ]
// });

// // Example 2: Multiple filters
// const multiFilterQuery = buildQuery(db, 'users', {
//   filters: [
//     { field: 'state', operator: '==', value: 'CA' },
//     { field: 'age', operator: '>=', value: 18 },
//     { field: 'isActive', operator: '==', value: true }
//   ]
// });

// // Example 3: With ordering and limit
// const orderedQuery = buildQuery(db, 'products', {
//   filters: [
//     { field: 'category', operator: '==', value: 'electronics' },
//     { field: 'price', operator: '<=', value: 1000 }
//   ],
//   orderBy: [
//     { field: 'price', direction: 'desc' }
//   ],
//   limit: 10
// });

// // Example 4: Pagination
// const paginatedQuery = buildQuery(db, 'posts', {
//   filters: [
//     { field: 'published', operator: '==', value: true }
//   ],
//   orderBy: [
//     { field: 'createdAt', direction: 'desc' }
//   ],
//   limit: 20,
//   startAfter: lastDocumentSnapshot // from previous query
// });

// // Example 5: Array and range queries
// const complexQuery = buildQuery(db, 'items', {
//   filters: [
//     { field: 'tags', operator: 'array-contains', value: 'featured' },
//     { field: 'stock', operator: '>', value: 0 }
//   ],
//   orderBy: [
//     { field: 'stock', direction: 'asc' },
//     { field: 'name', direction: 'asc' }
//   ],
//   limit: 50
// });
