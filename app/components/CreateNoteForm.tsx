'use client'
import { useEffect, useState } from "react"
import { createNoteAction } from "../notes/actions" 

export default function CreateNoteForm() {
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('')

    // 💡 Track standard loading state and the specific cooldown countdown
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    // 💡 Active countdown timer effect
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [cooldown])

    async function createNote(e: React.FormEvent) {
        e.preventDefault()

        // Guard clause: stop execution if already submitting, during cooldown, or inputs are empty
        if (isSubmitting || cooldown > 0 || !content.trim() || !author.trim()) return

        setIsSubmitting(true)

        const formData = new FormData()
        formData.append('content', content)
        formData.append('author', author)

        await createNoteAction(formData)

        setIsSubmitting(false)
        setCooldown(10) // Start a 5-second cooldown
        setContent('') // Clear the content field
        setAuthor('')  // Clear the author field
    }

    // Determine if the button should be locked
    const isButtonDisabled = isSubmitting || cooldown > 0

    return <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold mb-2">Create Note</h2>
        <label htmlFor="content">Content:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="border rounded shadow-sm" id="content" name="content" />
        <label htmlFor="author">Author:</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} className="border rounded shadow-sm" type="text" id="author" name="author" />
        <button 
                onClick={createNote} 
                disabled={isButtonDisabled}
                className={`text-white py-2 px-4 rounded font-medium transition-all ${
                    isButtonDisabled 
                        ? 'bg-gray-400 cursor-not-allowed opacity-75' 
                        : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                }`}
            >
                {/* 💡 Dynamic text based on current status */}
                {isSubmitting && "Creating..."}
                {!isSubmitting && cooldown > 0 && `Please wait ${cooldown}s...`}
                {!isSubmitting && cooldown === 0 && "Create"}
            </button>

            {/* 💡 Friendly message beneath the button to explain the lock */}
            {cooldown > 0 && (
                <p className="text-sm text-amber-600 font-medium animate-pulse">
                    ⚠️ Anti-spam filter active. You can create another note in {cooldown} seconds.
                </p>
            )}
      </div>
}