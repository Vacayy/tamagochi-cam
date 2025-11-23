export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (password === process.env.PASSWORD) {
            return Response.json({ success: true });
        }

        return Response.json(
            { success: false, message: '비밀번호를 확인해주세요' },
            { status: 401 }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: '에러가 발생했습니다' },
            { status: 500 }
        );
    }
}
