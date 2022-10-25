// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const graphqlRequest = require("graphql-request");
const _ = require('lodash');
import { generateSvg } from '../../utils/generateSVG';
import BadgeIconImg from "../../public/Badge-icon.png";
const axios = require('axios');
import { BASEURL, LEETCODE_BASEURL, THEME_NAMES } from "../../utils/config";

type Data = {
    status: string,
    body: string | Object
}
interface Params {
    username: string,
    jsonFlag: string,
    theme: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | string>): Promise<any> {
    try {
        let { username, jsonFlag, theme }: Params = <any>req.query;

        if (!username || <string>username.trim() === '') {
            res.status(400).send({
                status: 'error',
                body: 'Missing username parameter in query'
            });
        }
        else {
            if (!theme || theme.length === 0) {
                theme = 'light';
            }
            else theme = theme.trim().toLowerCase();
            if (!THEME_NAMES.includes(theme)) {
                theme = 'light';
            }
            const gqlQuery = graphqlRequest.gql`
            query userBadges($username: String!) 
            {  matchedUser(username: $username) 
                {    badges 
                    {      id      name      shortName      displayName      icon      hoverText      medal 
                        {        slug        config 
                            {          iconGif          iconGifBackground        
                            }      
                        }      creationDate      category    
                    }    upcomingBadges 
                    {      name      icon      progress
                    }
                }
            }`;
            const variables = { username };
            let data = await graphqlRequest.request(`${LEETCODE_BASEURL}/graphql/`, gqlQuery, variables);
            if (data.matchedUser.badges.length === 0) {
                res.status(200).send({ status: "success", body: "The user has unlocked 0 badges" });
                return;
            }
            for (let badge of data.matchedUser.badges) {
                if (badge.icon.startsWith("/static/")) {
                    badge.icon = LEETCODE_BASEURL + badge.icon;
                }
                try {
                    const { data } = await axios.get(`${BASEURL}/api/proxy`, {
                        params: {
                            img: badge.icon,
                        },
                    });
                    badge.icon = data;
                } catch {
                    badge.icon = BadgeIconImg;
                }
            }
            // Converting Leetcode logo to inline base64 to prevent Github CSP violation.
            const imgURL = `${BASEURL}/leetcode-logo.png`;
            const response = await axios.get(`${BASEURL}/api/proxy`, { params: { img: imgURL } });
            const imgSource = response.data;

            data = _.groupBy(data.matchedUser.badges, "category");
            let arr = []
            for (const [category, badges] of Object.entries(data)) {
                arr.push({ categoryName: category, badges });
            }
            if (jsonFlag?.toLowerCase() === 'true') {
                res.status(200).send({ status: "success", body: arr });
            }
            else {
                res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
                res.setHeader('Content-Type', 'image/svg+xml');
                res.statusCode = 200;
                res.send(generateSvg(arr, username, imgSource, theme));
            }
        }
    }
    catch (err: any) {
        console.error(err.message);
        res.status(500).send({
            status: 'error',
            body: 'The user does not exist 🔍 or some other error occured 😔'
        });
    }
}
