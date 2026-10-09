'use client'
import { useState, useEffect } from "react";
import { deleteNoteAction, editNoteAction } from "../notes/actions"
// 💡 Import the global store helpers
import { getGlobalCooldown, subscribeToGlobalCooldown, startGlobalCooldown } from "@/lib/globalCooldown"

export default function Note({ note }: { note: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(note.content);
    const [updatedAuthor, setUpdatedAuthor] = useState(note.author);
    
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // 💡 Read from the shared global clock state
    const [globalCooldownTime, setGlobalCooldownTime] = useState(getGlobalCooldown());

    // 💡 Wire up the global listener allocation
    useEffect(() => {
        const unsubscribe = subscribeToGlobalCooldown((time) => {
            setGlobalCooldownTime(time);
        });
        return unsubscribe;
    }, []);

    // 💡 Global cooldown blocks operations on this note instance instantly
    const isLocked = isDeleting || isSaving || globalCooldownTime > 0;

    const handleDelete = async () => {
        if (isLocked) return;
        
        setIsDeleting(true);
        try {
            const result = await deleteNoteAction(note.id);
            if (result?.error) {
                alert(`Error deleting: ${result.error}`);
                setIsDeleting(false);
            } else {
                // 💡 If a deletion is successful, lock all REMAINING notes for 10s
                startGlobalCooldown(10);
                alert('Note deleted successfully!');
            }
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
        }
    };

    const handleEditSave = async () => {
        if (isLocked) return;

        if (isEditing) {
            if (!updatedContent.trim() || !updatedAuthor.trim()) {
                alert("Fields cannot be empty.");
                return;
            }

            setIsSaving(true);
            try {
                const result = await editNoteAction(note.id, updatedContent, updatedAuthor);
                
                if (result?.success) {
                    setIsEditing(false);
                    // 💡 Trigger the 10s cooldown penalty GLOBALLY across all notes
                    startGlobalCooldown(10); 
                    alert('Note edited successfully!');
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
                    {!isSaving && !isEditing && globalCooldownTime > 0 && `Wait ${globalCooldownTime}s`}
                    {!isSaving && !isEditing && globalCooldownTime === 0 && 'Edit'}
                    {!isSaving && isEditing && 'Save'}
                </button>

                {/* Anti-Spam Message HUD element */}
                {!isEditing && globalCooldownTime > 0 && (
                    <span className="text-xs text-amber-600 font-medium animate-pulse ml-2">
                        ⏳ List lock active ({globalCooldownTime}s)
                    </span>
                )}
            </div>
        </li>
    )
}
