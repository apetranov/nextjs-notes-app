'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from 'next/cache'

export async function createNoteAction(formData: FormData) {
    const supabase = await createClient()

    // Extract variables out of the form fields
    const content = formData.get('content') as string
    const author = formData.get('author') as string

    if (!content || !author) {
        return { error: 'Content and Author are required.' }
    }

    // Insert into Supabase
    const { data: newNote, error } = await supabase
        .from('notes')
        .insert({ content, author });

    if (error) {
        return { error: error.message }
    }

    // Refresh the page data immediately so the new note shows up in the list
    revalidatePath('/notes')
    return { success: true }
}