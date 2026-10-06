import { createClient } from '@/lib/supabase/server'
import CreateNoteForm from '../components/CreateNoteForm'

export default async function notesPage() {
  // 1. Initialize the server-side Supabase client
  const supabase = await createClient()

  // 2. Query all rows and columns from your table
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')

  // 3. Handle any potential database errors
  if (error) {
    return <div>Error loading notes: {error.message}</div>
  }

  // 4. Test insert into db notes table
  // const { data: newNote, error: insertError } = await supabase
  //   .from('notes')
  //   .insert({
  //     content: 'Hello, Supabase!',
  //     author: 'Lebron James'
  //   })

  console.log("notes", notes);

  // 4. Render the data
  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">My notes</h1>
      <CreateNoteForm />
      <ul className="space-y-2">
        {notes?.map((note: any) => (
          <li key={note.id} className="p-4 border rounded shadow-sm">
            {/* Replace 'name' with an actual column name from your table */}
            <span className="font-bold">{note.content || JSON.stringify(note)}</span>  
            <br />
            <span>by {note.author}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
