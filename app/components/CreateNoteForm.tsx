'use client'
import { useState } from "react"
import { createNoteAction } from "../notes/actions" 

export default function CreateNoteForm() {
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('')

    async function createNote(e: React.FormEvent) {
        e.preventDefault()

        const formData = new FormData()
        formData.append('content', content)
        formData.append('author', author)

        await createNoteAction(formData)
    }

    return <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold mb-2">Create Note</h2>
        <label htmlFor="content">Content:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="border rounded shadow-sm" id="content" name="content" />
        <label htmlFor="author">Author:</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} className="border rounded shadow-sm" type="text" id="author" name="author" />
        <button onClick={createNote} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Create</button>
      </div>
}