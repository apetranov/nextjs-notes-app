import deleteNoteAction from "../notes/actions"

export default function Note({ note }: { note: any }) {
    return (
        <li className="p-4 border rounded shadow-sm">
            {/* Replace 'name' with an actual column name from your table */}
            <span className="font-bold">{note.content || JSON.stringify(note)}</span>
            <br />
            <span>by {note.author}</span>
            <button onClick={async () => {
                'use server'
                await deleteNoteAction(note.id)
            }} className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
            </button>
        </li>
    )
}