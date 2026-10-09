'use client'
import { useState, useEffect } from "react"
import { createNoteAction } from "../notes/actions" 
// 💡 Import the global store helpers
import { getGlobalCooldown, subscribeToGlobalCooldown, startGlobalCooldown } from "@/lib/globalCooldown"

export default function CreateNoteForm() {
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // 💡 Synchronize with the global clock instance
    const [globalCooldownTime, setGlobalCooldownTime] = useState(getGlobalCooldown())

    useEffect(() => {
        const unsubscribe = subscribeToGlobalCooldown((time) => {
            setGlobalCooldownTime(time);
        });
        return unsubscribe;
    }, []);

    async function createNote(e: React.FormEvent) {
        e.preventDefault()

        if (isSubmitting || globalCooldownTime > 0 || !content.trim() || !author.trim()) return

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('content', content)
            formData.append('author', author)

            const result = await createNoteAction(formData)

            if (result?.success) {
                setContent('')
                setAuthor('')
                alert('Note created successfully!')
                // 💡 Trigger the lock globally for all forms and notes
                startGlobalCooldown(10); 
            } else if (result?.error) {
                alert(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isButtonDisabled = isSubmitting || globalCooldownTime > 0

    return (
        <div className="flex flex-col space-y-4 border p-4 rounded bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">Create Note</h2>
            
            <label htmlFor="content">Content:</label>
            <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="border rounded shadow-sm p-2 bg-white" 
                id="content" 
                disabled={isButtonDisabled}
            />
            
            <label htmlFor="author">Author:</label>
            <input 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)} 
                className="border rounded shadow-sm p-2 bg-white" 
                type="text" 
                id="author" 
                disabled={isButtonDisabled}
            />
            
            <button 
                onClick={createNote} 
                disabled={isButtonDisabled}
                className={`text-white py-2 px-4 rounded font-medium transition-all ${
                    isButtonDisabled 
                        ? 'bg-gray-400 cursor-not-allowed opacity-75' 
                        : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                }`}
            >
                {isSubmitting && "Creating..."}
                {!isSubmitting && globalCooldownTime > 0 && `Please wait ${globalCooldownTime}s...`}
                {!isSubmitting && globalCooldownTime === 0 && "Create"}
            </button>
        </div>
    )
}
