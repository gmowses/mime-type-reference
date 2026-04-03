import { useState, useMemo } from 'react'
import { Search, Sun, Moon, Languages, FileType, Copy, Check } from 'lucide-react'

const translations = {
  en: {
    title: 'MIME Type Reference',
    subtitle: 'Search 100+ MIME types by file extension or MIME type string. Client-side only.',
    searchPlaceholder: 'Search by extension (.jpg) or MIME type (image/jpeg)...',
    extension: 'Extension',
    mimeType: 'MIME Type',
    category: 'Category',
    description: 'Description',
    noResults: 'No results found. Try a different search term.',
    results: 'results',
    allCategories: 'All categories',
    copy: 'Copy',
    copied: 'Copied!',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Referencia de Tipos MIME',
    subtitle: 'Pesquise 100+ tipos MIME por extensao de arquivo ou string MIME. Tudo no navegador.',
    searchPlaceholder: 'Pesquise por extensao (.jpg) ou tipo MIME (image/jpeg)...',
    extension: 'Extensao',
    mimeType: 'Tipo MIME',
    category: 'Categoria',
    description: 'Descricao',
    noResults: 'Nenhum resultado. Tente outro termo de busca.',
    results: 'resultados',
    allCategories: 'Todas as categorias',
    copy: 'Copiar',
    copied: 'Copiado!',
    builtBy: 'Criado por',
  }
} as const

type Lang = keyof typeof translations

interface MimeEntry {
  ext: string[]
  mime: string
  category: string
  desc: string
}

const MIME_DATA: MimeEntry[] = [
  // Images
  { ext: ['.jpg', '.jpeg'], mime: 'image/jpeg', category: 'Image', desc: 'JPEG image' },
  { ext: ['.png'], mime: 'image/png', category: 'Image', desc: 'PNG image' },
  { ext: ['.gif'], mime: 'image/gif', category: 'Image', desc: 'GIF image' },
  { ext: ['.webp'], mime: 'image/webp', category: 'Image', desc: 'WebP image' },
  { ext: ['.svg'], mime: 'image/svg+xml', category: 'Image', desc: 'SVG vector image' },
  { ext: ['.ico'], mime: 'image/x-icon', category: 'Image', desc: 'Icon file' },
  { ext: ['.bmp'], mime: 'image/bmp', category: 'Image', desc: 'Bitmap image' },
  { ext: ['.tiff', '.tif'], mime: 'image/tiff', category: 'Image', desc: 'TIFF image' },
  { ext: ['.avif'], mime: 'image/avif', category: 'Image', desc: 'AVIF image' },
  { ext: ['.heic'], mime: 'image/heic', category: 'Image', desc: 'HEIC image' },
  { ext: ['.heif'], mime: 'image/heif', category: 'Image', desc: 'HEIF image' },
  // Video
  { ext: ['.mp4'], mime: 'video/mp4', category: 'Video', desc: 'MP4 video' },
  { ext: ['.webm'], mime: 'video/webm', category: 'Video', desc: 'WebM video' },
  { ext: ['.ogg', '.ogv'], mime: 'video/ogg', category: 'Video', desc: 'Ogg video' },
  { ext: ['.avi'], mime: 'video/x-msvideo', category: 'Video', desc: 'AVI video' },
  { ext: ['.mov'], mime: 'video/quicktime', category: 'Video', desc: 'QuickTime video' },
  { ext: ['.wmv'], mime: 'video/x-ms-wmv', category: 'Video', desc: 'Windows Media Video' },
  { ext: ['.flv'], mime: 'video/x-flv', category: 'Video', desc: 'Flash video' },
  { ext: ['.mkv'], mime: 'video/x-matroska', category: 'Video', desc: 'Matroska video' },
  { ext: ['.3gp'], mime: 'video/3gpp', category: 'Video', desc: '3GPP video' },
  // Audio
  { ext: ['.mp3'], mime: 'audio/mpeg', category: 'Audio', desc: 'MP3 audio' },
  { ext: ['.wav'], mime: 'audio/wav', category: 'Audio', desc: 'WAV audio' },
  { ext: ['.ogg', '.oga'], mime: 'audio/ogg', category: 'Audio', desc: 'Ogg audio' },
  { ext: ['.flac'], mime: 'audio/flac', category: 'Audio', desc: 'FLAC lossless audio' },
  { ext: ['.aac'], mime: 'audio/aac', category: 'Audio', desc: 'AAC audio' },
  { ext: ['.m4a'], mime: 'audio/mp4', category: 'Audio', desc: 'M4A audio' },
  { ext: ['.weba'], mime: 'audio/webm', category: 'Audio', desc: 'WebM audio' },
  { ext: ['.opus'], mime: 'audio/opus', category: 'Audio', desc: 'Opus audio' },
  { ext: ['.mid', '.midi'], mime: 'audio/midi', category: 'Audio', desc: 'MIDI audio' },
  // Text
  { ext: ['.html', '.htm'], mime: 'text/html', category: 'Text', desc: 'HTML document' },
  { ext: ['.css'], mime: 'text/css', category: 'Text', desc: 'CSS stylesheet' },
  { ext: ['.js', '.mjs'], mime: 'text/javascript', category: 'Text', desc: 'JavaScript' },
  { ext: ['.ts'], mime: 'text/typescript', category: 'Text', desc: 'TypeScript' },
  { ext: ['.txt'], mime: 'text/plain', category: 'Text', desc: 'Plain text' },
  { ext: ['.csv'], mime: 'text/csv', category: 'Text', desc: 'CSV spreadsheet' },
  { ext: ['.xml'], mime: 'text/xml', category: 'Text', desc: 'XML document' },
  { ext: ['.md'], mime: 'text/markdown', category: 'Text', desc: 'Markdown document' },
  { ext: ['.yaml', '.yml'], mime: 'text/yaml', category: 'Text', desc: 'YAML document' },
  { ext: ['.ics'], mime: 'text/calendar', category: 'Text', desc: 'iCalendar file' },
  { ext: ['.vtt'], mime: 'text/vtt', category: 'Text', desc: 'WebVTT subtitles' },
  // Application
  { ext: ['.json'], mime: 'application/json', category: 'Application', desc: 'JSON data' },
  { ext: ['.jsonld'], mime: 'application/ld+json', category: 'Application', desc: 'JSON-LD linked data' },
  { ext: ['.pdf'], mime: 'application/pdf', category: 'Application', desc: 'PDF document' },
  { ext: ['.zip'], mime: 'application/zip', category: 'Application', desc: 'ZIP archive' },
  { ext: ['.gz'], mime: 'application/gzip', category: 'Application', desc: 'Gzip archive' },
  { ext: ['.tar'], mime: 'application/x-tar', category: 'Application', desc: 'TAR archive' },
  { ext: ['.7z'], mime: 'application/x-7z-compressed', category: 'Application', desc: '7-Zip archive' },
  { ext: ['.rar'], mime: 'application/vnd.rar', category: 'Application', desc: 'RAR archive' },
  { ext: ['.doc'], mime: 'application/msword', category: 'Application', desc: 'Word document (legacy)' },
  { ext: ['.docx'], mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', category: 'Application', desc: 'Word document' },
  { ext: ['.xls'], mime: 'application/vnd.ms-excel', category: 'Application', desc: 'Excel spreadsheet (legacy)' },
  { ext: ['.xlsx'], mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', category: 'Application', desc: 'Excel spreadsheet' },
  { ext: ['.ppt'], mime: 'application/vnd.ms-powerpoint', category: 'Application', desc: 'PowerPoint (legacy)' },
  { ext: ['.pptx'], mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', category: 'Application', desc: 'PowerPoint presentation' },
  { ext: ['.odt'], mime: 'application/vnd.oasis.opendocument.text', category: 'Application', desc: 'OpenDocument text' },
  { ext: ['.ods'], mime: 'application/vnd.oasis.opendocument.spreadsheet', category: 'Application', desc: 'OpenDocument spreadsheet' },
  { ext: ['.odp'], mime: 'application/vnd.oasis.opendocument.presentation', category: 'Application', desc: 'OpenDocument presentation' },
  { ext: ['.wasm'], mime: 'application/wasm', category: 'Application', desc: 'WebAssembly binary' },
  { ext: ['.bin'], mime: 'application/octet-stream', category: 'Application', desc: 'Binary data' },
  { ext: ['.exe'], mime: 'application/x-msdownload', category: 'Application', desc: 'Windows executable' },
  { ext: ['.dmg'], mime: 'application/x-apple-diskimage', category: 'Application', desc: 'macOS disk image' },
  { ext: ['.apk'], mime: 'application/vnd.android.package-archive', category: 'Application', desc: 'Android package' },
  { ext: ['.jar'], mime: 'application/java-archive', category: 'Application', desc: 'Java archive' },
  { ext: ['.swf'], mime: 'application/x-shockwave-flash', category: 'Application', desc: 'Flash (deprecated)' },
  { ext: ['.rtf'], mime: 'application/rtf', category: 'Application', desc: 'Rich Text Format' },
  { ext: ['.sql'], mime: 'application/sql', category: 'Application', desc: 'SQL script' },
  { ext: ['.xhtml'], mime: 'application/xhtml+xml', category: 'Application', desc: 'XHTML document' },
  { ext: ['.atom'], mime: 'application/atom+xml', category: 'Application', desc: 'Atom feed' },
  { ext: ['.rss'], mime: 'application/rss+xml', category: 'Application', desc: 'RSS feed' },
  { ext: ['.graphql'], mime: 'application/graphql', category: 'Application', desc: 'GraphQL query' },
  { ext: ['.pb'], mime: 'application/x-protobuf', category: 'Application', desc: 'Protocol Buffer' },
  { ext: ['.cbor'], mime: 'application/cbor', category: 'Application', desc: 'CBOR binary' },
  { ext: ['.msgpack'], mime: 'application/msgpack', category: 'Application', desc: 'MessagePack binary' },
  // Fonts
  { ext: ['.woff'], mime: 'font/woff', category: 'Font', desc: 'WOFF web font' },
  { ext: ['.woff2'], mime: 'font/woff2', category: 'Font', desc: 'WOFF2 web font' },
  { ext: ['.ttf'], mime: 'font/ttf', category: 'Font', desc: 'TrueType font' },
  { ext: ['.otf'], mime: 'font/otf', category: 'Font', desc: 'OpenType font' },
  { ext: ['.eot'], mime: 'application/vnd.ms-fontobject', category: 'Font', desc: 'Embedded OpenType font' },
  // Multipart
  { ext: ['-'], mime: 'multipart/form-data', category: 'Multipart', desc: 'Form data with files' },
  { ext: ['-'], mime: 'multipart/byteranges', category: 'Multipart', desc: 'Byte range response' },
  { ext: ['-'], mime: 'multipart/mixed', category: 'Multipart', desc: 'Mixed multipart body' },
  // Source code (common)
  { ext: ['.py'], mime: 'text/x-python', category: 'Code', desc: 'Python source code' },
  { ext: ['.go'], mime: 'text/x-go', category: 'Code', desc: 'Go source code' },
  { ext: ['.rs'], mime: 'text/x-rust', category: 'Code', desc: 'Rust source code' },
  { ext: ['.java'], mime: 'text/x-java-source', category: 'Code', desc: 'Java source code' },
  { ext: ['.c'], mime: 'text/x-c', category: 'Code', desc: 'C source code' },
  { ext: ['.cpp', '.cc'], mime: 'text/x-c++src', category: 'Code', desc: 'C++ source code' },
  { ext: ['.sh'], mime: 'application/x-sh', category: 'Code', desc: 'Shell script' },
  { ext: ['.php'], mime: 'application/x-httpd-php', category: 'Code', desc: 'PHP source' },
  { ext: ['.rb'], mime: 'application/x-ruby', category: 'Code', desc: 'Ruby source code' },
  // 3D / Model
  { ext: ['.gltf'], mime: 'model/gltf+json', category: '3D', desc: 'glTF 3D model (JSON)' },
  { ext: ['.glb'], mime: 'model/gltf-binary', category: '3D', desc: 'glTF 3D model (binary)' },
  { ext: ['.obj'], mime: 'model/obj', category: '3D', desc: 'OBJ 3D model' },
  // Misc
  { ext: ['.epub'], mime: 'application/epub+zip', category: 'Document', desc: 'EPUB e-book' },
  { ext: ['.toml'], mime: 'application/toml', category: 'Text', desc: 'TOML configuration' },
  { ext: ['.geojson'], mime: 'application/geo+json', category: 'Application', desc: 'GeoJSON geographic data' },
  { ext: ['.har'], mime: 'application/json', category: 'Application', desc: 'HTTP Archive format' },
  { ext: ['.torrent'], mime: 'application/x-bittorrent', category: 'Application', desc: 'BitTorrent file' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Image: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Video: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Audio: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Text: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Application: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Font: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Multipart: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  Code: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  '3D': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  Document: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
}

export default function MimeTypeReference() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [copiedMime, setCopiedMime] = useState<string | null>(null)

  const t = translations[lang]

  const categories = useMemo(() => ['All', ...Array.from(new Set(MIME_DATA.map(m => m.category))).sort()], [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return MIME_DATA.filter(m => {
      const matchCat = category === 'All' || m.category === category
      const matchSearch = !q || m.mime.toLowerCase().includes(q) || m.ext.some(e => e.toLowerCase().includes(q)) || m.desc.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, category])

  const handleCopy = (mime: string) => {
    navigator.clipboard.writeText(mime).then(() => {
      setCopiedMime(mime)
      setTimeout(() => setCopiedMime(null), 2000)
    })
  }

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileType size={18} className="text-white" />
            </div>
            <span className="font-semibold">MIME Type Reference</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/mime-type-reference" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">{t.allCategories}</option>
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">{filtered.length} {t.results}</p>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">{t.extension}</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">{t.mimeType}</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">{t.category}</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">{t.description}</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {m.ext.join(', ')}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400 break-all">{m.mime}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[m.category] ?? 'bg-zinc-100 text-zinc-700'}`}>
                          {m.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{m.desc}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleCopy(m.mime)}
                          title={copiedMime === m.mime ? t.copied : t.copy}
                          className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        >
                          {copiedMime === m.mime ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">{t.noResults}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-blue-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
