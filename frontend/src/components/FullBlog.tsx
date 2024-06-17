import { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"

export const FullBlog = ({ post }: { post: Blog }) => {
    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-2xl pt-12">
                <div className="col-span-8">
                    <div className="text-5xl font-extrabold">
                        {post.title}
                    </div>
                    <div className="text-slate-500 pt-2">Posted on 24 Feb 2024</div>
                    <div className="pt-4">
                        {post.content}
                    </div>

                </div>
                <div className="col-span-4">
                    <div className="text-slate-600 text-lg">Author</div>
                    <div className="flex w-full">
                        <div className="pr-4 flex flex-col justify-center">
                            <Avatar size={8} name={post.author.name || "Ananymous"} />

                        </div>
                        <div>
                            <div className="text-xl  font-bold" >{post.author.name || "Anonymous"}</div>
                            <div className="pt-2 text-slate-500"> Together, we weave our destiny and transform the world. United by purpose, we rise and make dreams reality.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}