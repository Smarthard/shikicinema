  export interface AnimeFranchiseLink {
    source_id: number;
    target_id: number;
    relation: string;
}

  export interface AnimeFranchiseNode {
    id: number;
    name: string;
    poster: string;
    year: number;
    kind: string;
    status: string;
}
