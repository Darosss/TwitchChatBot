import Express, { Request, Response } from "express";
import { IRequestParams, IRequestRedemptionQuery } from "@types";
import { filterRedemptionsByUrlParams } from "./filters/redemptions.filter";
import { getRedemptions, getRedemptionsCount } from "@services/Redemption";
import { getTwitchSessionById } from "@services/TwitchSession";

const getRedemptionsList = async (
  req: Request<{}, {}, {}, IRequestRedemptionQuery>,
  res: Response
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterRedemptionsByUrlParams(req.query);
  try {
    const redemptions = await getRedemptions(searchFilter, {
      limit: limit,
      skip: page,
      sort: {
        redemptionDate: -1,
      },
    });

    const count = await getRedemptionsCount(searchFilter);

    return res.status(200).send({
      data: redemptions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

const getUserRedemptions = async (
  req: Request<IRequestParams, {}, {}, IRequestRedemptionQuery>,
  res: Response
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = Object.assign(
    { userId: id },
    filterRedemptionsByUrlParams(req.query)
  );

  try {
    const redemptions = await getRedemptions(searchFilter, {
      limit: limit,
      skip: page,
      sort: { redemptionDate: -1 },
    });

    const count = await getRedemptionsCount(searchFilter);

    return res.status(200).send({
      data: redemptions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

const getSessionRedemptions = async (
  req: Request<IRequestParams, {}, {}, IRequestRedemptionQuery>,
  res: Response
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  if (!id)
    return res
      .status(400)
      .send({ message: "There is problem with session id" });

  try {
    const session = await getTwitchSessionById(id, { select: { __v: 0 } });

    const searchFilter = Object.assign(
      {
        redemptionDate: {
          $gte: session?.sessionStart,
          $lte: session?.sessionEnd,
        },
      },
      filterRedemptionsByUrlParams(req.query)
    );
    const redemptions = await getRedemptions(searchFilter, {
      limit: limit,
      skip: page,
      sort: { redemptionDate: -1 },
    });

    const count = await getRedemptionsCount(searchFilter);

    return res.status(200).send({
      data: redemptions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

export { getRedemptionsList, getUserRedemptions, getSessionRedemptions };
