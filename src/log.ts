export function log(message: string) {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`)
}