
export default function ResultadosGestorSkeleton() {
    return (
        <section className="grid gap-5 mb-10" style={{
            gridTemplateAreas:
                `'lap lap lap en en en en'
                        'tl tl tl en en en en'
                        'cat cat cat en en en en'
                        'dn dn dn en en en en'
                        'lg lg lg en en en en'
                        `,
            gridTemplateColumns: '1fr 0.8fr 0fr 1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr 1fr'
        }}>
            <div className="skeleton-load border-white border rounded-lg flex items-center h-16" style={{ gridArea: 'lap' }}>
            </div>
            <div className="skeleton-load border-white border rounded-lg flex items-center h-16" style={{ gridArea: 'cat' }}>
            </div>
            <div className="skeleton-load border-white border rounded-lg flex items-center h-16" style={{ gridArea: 'dn' }}>
            </div>
            <div style={{ gridArea: 'tl' }} className="skeleton-load border-white border rounded-lg h-full flex items-center">
            </div>
            <div className="skeleton-load border-white border rounded-lg flex items-center h-16" style={{ gridArea: 'lg' }}>
            </div>
            <div className="skeleton-load border-white border rounded-lg flex flex-col px-2 items-center" style={{ gridArea: 'en' }}>
            </div>
        </section>
    )
}
