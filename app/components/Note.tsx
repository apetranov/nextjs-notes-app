'use client'
import { useState, useEffect } from "react";
import { deleteNoteAction, editNoteAction } from "../notes/actions"
// import {  } from "../notes/actions"

export default function Note({ note }: { note: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(note.content);
    const [updatedAuthor, setUpdatedAuthor] = useState(note.author);
    
    return (
        <li className="p-4 border rounded shadow-sm">
            {/* Replace 'name' with an actual column name from your table */}
            {/* <span className="font-bold">{note.content || JSON.stringify(note)}</span> */}
            <br />
            {isEditing ? <textarea onChange={(e) => setUpdatedContent(e.target.value)} value={updatedContent} className="border rounded p-2" / > : <span className="font-bold">{note.content}</span>}
            <br/>
            {isEditing ? <input value={updatedAuthor} onChange={(e) => setUpdatedAuthor(e.target.value)} className="border rounded p-2" /> : <span>by {note.author}</span>}
            <button onClick={async () => {
                await deleteNoteAction(note.id)
            }} className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
            </button>
            <button onClick={async () => {
                if (isEditing) {
                    const result = await editNoteAction(note.id, updatedContent, updatedAuthor)
                    setIsEditing(false)

                    if (result?.error) {
                            alert(`Error saving: ${result.error}`);
                    }
                } else {
                    setIsEditing(true)
                }
            }} className={`ml-2 px-2 py-1 ${isEditing ? 'bg-green-500' : 'bg-blue-500'} text-white rounded ${isEditing ? 'hover:bg-green-600' : 'hover:bg-blue-600'}`}>
                {isEditing ? 'Save' : 'Edit'}
            </button>
        </li>
    )
}