'use client'
import { useState } from "react";
import { deleteNoteAction } from "../notes/actions"
import { editNoteAction } from "../notes/actions"

export default function Note({ note }: { note: any }) {
    const [isEditing, setIsEditing] = useState(false);

    
    return (
        <li className="p-4 border rounded shadow-sm">
            {/* Replace 'name' with an actual column name from your table */}
            <span className="font-bold">{note.content || JSON.stringify(note)}</span>
            <br />
            <span>by {note.author}</span>
            <button onClick={async () => {
                await deleteNoteAction(note.id)
            }} className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
            </button>
            <button onClick={() => setIsEditing(!isEditing)} className={`ml-2 px-2 py-1 ${isEditing ? 'bg-green-500' : 'bg-blue-500'} text-white rounded ${isEditing ? 'hover:bg-green-600' : 'hover:bg-blue-600'}`}>
                {isEditing ? 'Save' : 'Edit'}
            </button>
        </li>
    )
}