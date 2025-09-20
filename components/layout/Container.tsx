const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full max-w-3xl mx-auto">
            {children}
        </div>
    )
}

export default Container;