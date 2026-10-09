'use client'
import { useState, useEffect } from "react";
import { deleteNoteAction, editNoteAction } from "../notes/actions"

export default function Note({ note }: { note: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(note.content);
    const [updatedAuthor, setUpdatedAuthor] = useState(note.author);
    
    // 💡 Track network activity and cooldown counters individually
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // 💡 Active countdown clock logic
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    // Combined state helper to completely freeze all note fields/actions during any processing window
    const isLocked = isDeleting || isSaving || cooldown > 0;

    const handleDelete = async () => {
        if (isLocked) return;
        
        setIsDeleting(true);
        try {
            const result = await deleteNoteAction(note.id);
            if (result?.error) {
                alert(`Error deleting: ${result.error}`);
                setIsDeleting(false); // Only unlock if the deletion failed
            }
            // If successful, Next.js handles removing the node, no cooldown necessary for a deleted row!
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
        }
    };

    const handleEditSave = async () => {
        if (isLocked) return;

        if (isEditing) {
            // Guard clause to avoid writing empty values
            if (!updatedContent.trim() || !updatedAuthor.trim()) {
                alert("Fields cannot be empty.");
                return;
            }

            setIsSaving(true);
            try {
                const result = await editNoteAction(note.id, updatedContent, updatedAuthor);
                
                if (result?.success) {
                    setIsEditing(false);
                    setCooldown(10); // 💡 Trigger the 10s cooldown penalty upon successful save
                } else if (result?.error) {
                    alert(`Error saving: ${result.error}`);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsSaving(false);
            }
        } else {
            setIsEditing(true);
        }
    };

    return (
        <li className="p-4 border rounded shadow-sm flex flex-col space-y-2 bg-white">
            <div>
                {isEditing ? (
                    <textarea 
                        onChange={(e) => setUpdatedContent(e.target.value)} 
                        value={updatedContent} 
                        className="border rounded p-2 w-full"
                        disabled={isLocked}
                    />
                ) : (
                    <span className="font-bold block text-gray-800 break-words">{note.content}</span>
                )}
                
                <div className="mt-1">
                    {isEditing ? (
                        <input 
                            value={updatedAuthor} 
                            onChange={(e) => setUpdatedAuthor(e.target.value)} 
                            className="border rounded p-2 w-full mt-1 text-sm"
                            disabled={isLocked}
                        />
                    ) : (
                        <span className="text-sm text-gray-500">by {note.author}</span>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                {/* Delete Button */}
                <button 
                    onClick={handleDelete} 
                    disabled={isLocked}
                    className={`px-3 py-1 text-white rounded transition-all text-sm font-medium ${
                        isLocked 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600 active:scale-95'
                    }`}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>

                {/* Edit / Save Button */}
                <button 
                    onClick={handleEditSave} 
                    disabled={isLocked}
                    className={`px-3 py-1 text-white rounded transition-all text-sm font-medium ${
                        isLocked 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : isEditing 
                                ? 'bg-green-500 hover:bg-green-600 active:scale-95' 
                                : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                    }`}
                >
                    {isSaving && 'Saving...'}
                    {!isSaving && !isEditing && cooldown > 0 && `Wait ${cooldown}s`}
                    {!isSaving && !isEditing && cooldown === 0 && 'Edit'}
                    {!isSaving && isEditing && 'Save'}
                </button>

                {/* Anti-Spam Message HUD element */}
                {!isEditing && cooldown > 0 && (
                    <span className="text-xs text-amber-600 font-medium animate-pulse ml-2">
                        ⏳ Cooldown active ({cooldown}s)
                    </span>
                )}
            </div>
        </li>
    )
}
