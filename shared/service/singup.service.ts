export async function signup(
    username: string,
    password: string 
) { 
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (username === "suho123"){
        throw new Error("이미 사용중인 계정입니다")
    }

    return { success : true }
}
