import { Request, Response } from 'express';
import { apiSuccess } from '../api/success.api';
import CustomError from '../errors/custom.error';
import { orderController } from './order.controller';

/**
 * Exposed service endpoint.
 * - Receives a POST request, parses the action and the controller
 * and returns it to the correct controller. We should be use 3. `Cart`, `Order` and `Payments`
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (request: Request, response: Response) => {
  // Deserialize the action and resource from the body
  const { action, resource } = request.body;

  if (!action || !resource) {
    throw new CustomError(400, 'Bad request - Missing body parameters.');
  }

  // Identify the type of resource in order to redirect
  // to the correct controller
  console.log(resource.typeId);
  switch (resource.typeId) {
    case 'order':
      try {
        const data = await orderController(action, resource);
        if (data && data.statusCode === 200) {
          apiSuccess(200, data.actions, response);
          return;
        }

        throw new CustomError(
          data ? data.statusCode : 400,
          JSON.stringify(data?.actions[0].action)
        );
      } catch (error) {
        console.log("here");
        if (error instanceof Error) {
          throw new CustomError(500, error.message);
        }
      }
      break;

    default:
      throw new CustomError(
        500,
        `Internal Server Error - Resource not recognized. Allowed values are 'cart', 'payments' or 'orders'.`
      );
  }
};
