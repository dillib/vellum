import { useState } from 'react'
import { X, Star, Folder, Trash2, Edit2, Plus } from 'lucide-react'

interface Bookmark {
  id: string
  title: string
  url: string
  favicon?: string
  folderId?: string
  createdAt: Date
}

interface BookmarkFolder {
  id: string
  name: string
  bookmarks: Bookmark[]
}

interface BookmarksProps {
  onClose: () => void
  onNavigate: (url: string) => void
}

export default function Bookmarks({ onClose, onNavigate }: BookmarksProps) {
  const [folders, setFolders] = useState<BookmarkFolder[]>([
    {
      id: 'default',
      name: 'Bookmarks Bar',
      bookmarks: [
        {
          id: '1',
          title: 'Google',
          url: 'https://www.google.com',
          createdAt: new Date()
        },
        {
          id: '2',
          title: 'GitHub',
          url: 'https://github.com',
          createdAt: new Date()
        }
      ]
    }
  ])
  
  const [selectedFolder, setSelectedFolder] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')

  const currentFolder = folders.find(f => f.id === selectedFolder)
  const filteredBookmarks = currentFolder?.bookmarks.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.url.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleBookmarkClick = (url: string) => {
    onNavigate(url)
    onClose()
  }

  const handleDeleteBookmark = (bookmarkId: string) => {
    setFolders(folders.map(folder => ({
      ...folder,
      bookmarks: folder.bookmarks.filter(b => b.id !== bookmarkId)
    })))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-4xl h-[80vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Folders</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span className="flex-1 text-left">{folder.name}</span>
                <span className="text-xs text-muted-foreground">
                  {folder.bookmarks.length}
                </span>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-border">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent">
              <Plus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex-1 mr-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookmarks..."
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bookmarks Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredBookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Star className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">No bookmarks yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="group relative flex flex-col gap-2 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleBookmarkClick(bookmark.url)}
                  >
                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Edit bookmark
                        }}
                        className="p-1 rounded bg-background border border-border hover:bg-accent"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteBookmark(bookmark.id)
                        }}
                        className="p-1 rounded bg-background border border-border hover:bg-red-500/10 hover:border-red-500/50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Favicon */}
                    {bookmark.favicon ? (
                      <img src={bookmark.favicon} alt="" className="w-8 h-8" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
                        <Star className="w-4 h-4" />
                      </div>
                    )}

                    {/* Title */}
                    <div className="text-sm font-medium truncate">
                      {bookmark.title}
                    </div>

                    {/* URL */}
                    <div className="text-xs text-muted-foreground truncate">
                      {bookmark.url}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
