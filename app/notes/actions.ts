'use server'

import { createClient } from "@/lib/supabase/server"
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

async function getAuthedClient() {
    const { userId, getToken } = await auth()
    if (!userId) throw new Error("Unauthorized access attempt.")
    
    // Fetch the token using your native Clerk integration template
    const token = await getToken() 
    const supabase = await createClient(token)
    
    return { supabase, userId }
}

export async function createNoteAction(formData: FormData) {
    const { supabase, userId } = await getAuthedClient()

    // Extract variables out of the form fields
    const content = formData.get('content') as string
    const author = formData.get('author') as string

    if (!content || !author) {
        return { error: 'Content and Author are required.' }
    }

    // Insert into Supabase
    const { data: newNote, error } = await supabase
        .from('notes')
        .insert({ content, author, user_id: userId });

    if (error) {
        return { error: error.message }
    }

    // Refresh the page data immediately so the new note shows up in the list
    revalidatePath('/notes')
    return { success: true }
}

export async function deleteNoteAction(id: string) {
    // 1. Initialize the Supabase server client
    const { supabase } = await getAuthedClient()

    // 2. Delete the note with the given ID
    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    // 3. Refresh the page data immediately so the deleted note is removed from the list
    revalidatePath('/notes')
    return { success: true }
}

export async function editNoteAction(id: string, updatedContent: string, updatedAuthor: string) {
    const { supabase } = await getAuthedClient()

    const { error } = await supabase
        .from('notes')
        .update({ content: updatedContent, author: updatedAuthor })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/notes')
    return { success: true }
}