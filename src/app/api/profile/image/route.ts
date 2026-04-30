import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type UpdateProfilePhotoRequestBody = {
  image?: string;
};

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as UpdateProfilePhotoRequestBody;
  const image = body.image?.trim();

  if (!image) {
    return Response.json(
      { message: "Profile photo is required." },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      image,
    },
  });

  return Response.json({ image });
}
