import { NextFunction, Request, Response } from "express";

const authMiddlewares = (dependencies: any) => {
  const isAuthorized = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) throw new Error("No Authorization Token");
      if (authorization !== "TEST")
        return res.status(401).json({ message: "Not authorized." });
      next();
    } catch (err) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  return {
    isAuthorized,
  };
};

export default authMiddlewares;
