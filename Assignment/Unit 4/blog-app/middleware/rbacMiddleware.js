import Blog from "../models/Blog.js";

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${allowedRoles.join(", ")}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
}

export async function checkBlogOwnership(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.user.role === "admin") {
      req.blog = blog;
      return next();
    }

    if (req.user.role === "author") {
      if (blog.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Access denied. You can only modify or delete your own blogs.",
        });
      }
      req.blog = blog;
      return next();
    }

    return res.status(403).json({
      message: "Access denied. Users are not allowed to modify or delete blogs.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Authorization error", error: error.message });
  }
}
