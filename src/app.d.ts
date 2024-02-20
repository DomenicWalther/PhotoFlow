// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
    // interface PageData {}
    // interface Error {}
    // interface Platform {}
}

interface Tasks {
    name: String;
    dueAt: Date;
    additional_information: String;
    status: String;
    id: Number;
    created_at: Date;
    status: String;
    taskColumn: String;
    amount_of_comments: Number;
}
