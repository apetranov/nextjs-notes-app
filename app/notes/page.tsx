import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import CreateNoteForm from '../components/CreateNoteForm'
import Note from '../components/Note'


export default async function notesPage() {

  // await auth.protect()
  const { userId, getToken, isAuthenticated, redirectToSignIn } = await auth()

  if (!isAuthenticated) {
    // Add logic to handle the unauthenticated user
    // This example uses the `redirectToSignIn()` method to redirect the user to the sign-in page
    return redirectToSignIn()
  }

  

  // 1. Fetch token and initialize authenticated client instance
  const token = await getToken()
  const supabase = await createClient(token)

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
          <Note key={note.id} note={note} />
        ))}
      </ul>
    </main>
  )
}
