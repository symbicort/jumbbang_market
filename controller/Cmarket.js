const marketModel = require("../model/market");
const userModel = require("../model/user");
const { postUpload } = require("../utils/imgUploader");
const jwt = require("jsonwebtoken");

const { verifyToken } = require("../utils/token");

exports.market = async (req, res) => {
    marketModel
        .find()
        .populate("userid")
        .sort({ createdAt: -1 })
        .exec()
        .then((result) => {
            console.log("DB 정보 추출", result);
            res.header("Access-Control-Allow-Origin", "*");
            res.render("market", { postData: result });
        })
        .catch((error) => {
            console.error("Error finding data:", error);
        });
};

exports.marketsort = async (req, res) => {
    const sortnumber = req.query.selectedSort;
    console.log("sortnumber", sortnumber);
    let result;
    if (!sortnumber || sortnumber === "1") {
        result = await marketModel
            .find()
            .populate("userid")
            .sort({ updatedAt: -1 })
            .exec();
    } else if (sortnumber === "2") {
        result = await marketModel
            .find()
            .populate("userid")
            .sort({ bookmark_hit: -1 })
            .exec();
    } else if (sortnumber === "3") {
        result = await marketModel
            .find()
            .populate("userid")
            .sort({ priceLast: 1 })
            .exec();
    } else if (sortnumber === "4") {
        result = await marketModel
            .find()
            .populate("userid")
            .sort({ priceLast: -1 });
    }
    res.send({ postData: result });
};

exports.getView = async (req, res) => {
    const postId = req.params.id;

    try {
        // 조회된 데이터를 조회수 1 증가와 함께 가져오기
        const result = await marketModel
            .findByIdAndUpdate(postId, { $inc: { hit: 1 } }, { new: true })
            .populate("userid")
            .exec();

        // 결과를 처리하는 로직
        console.log(result);
        const productData = await marketModel
            .find()
            .populate("userid")
            .sort({ hit: -1 })
            .exec();

        // console.log(productData);
        res.header("Access-Control-Allow-Origin", "*");
        res.render("marketView", { postdata: result, productData });
    } catch (err) {
        // 에러를 처리하는 로직
        console.error(err);
        res.status(500).send({ msg: "Internal server error" });
    }
};

exports.getWrite = async (req, res) => {
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!token || !refreshToken) {
        res.render("login");
    } else {
        try {
            const decodedjwt = await verifyToken(token, refreshToken);

            if (decodedjwt.token != undefined) {
                res.render("marketWrite", { userid: decodedjwt.userid });
            } else {
                res.render("login");
            }
        } catch (err) {
            console.error("메인 페이지 랜딩 에러", err);
        }
    }
};

exports.addPost = async (req, res) => {
    // upload.array('files')를 사용하여 'files'라는 필드명으로 전송된 파일들을 처리
    postUpload.array("files")(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log(req.files.length);
        console.log(req.body);

        let images = [];

        for (let i = 0; i < req.files.length; i++) {
            images.push(req.files[i].location);
        }

        console.log(images);

        const {
            subject,
            comment,
            category,
            state,
            priceFirst,
            priceDirect,
            dateLimit,
        } = req.body;

        console.log(
            "글 작성 정보",
            subject,
            comment,
            state,
            priceFirst,
            priceDirect,
            dateLimit
        );

        const token = req.cookies.accessToken;
        console.log("글 작성 시 토큰", token);
        const decodedjwt = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        console.log("유저 정보", decodedjwt.userId);
        const userId = decodedjwt.userId;

        const user_info = await userModel.findOne({ userid: userId });

        const date = new Date();

        await marketModel
            .create({
                userid: user_info,
                category: category,
                state: state,
                subject: subject,
                content: comment,
                priceFirst: priceFirst,
                priceLast: priceFirst,
                priceDirect: priceDirect,
                dateLimit: dateLimit,
                images: images,
            })
            .then((res) => {
                console.log(userId, "이미지 등록 결과", res);
            });
        return res.status(200).json({ message: "Upload successful" });
    });
};

exports.enterbid = async (req, res) => {
    console.log("경매 시도");
    console.log(req.body);
    const { bidprice, productId } = req.body;
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!token || !refreshToken) {
        res.render("login");
    } else {
        try {
            const decodedjwt = await verifyToken(token, refreshToken);
            console.log("토큰 유효 검사 결과", decodedjwt);

            if (decodedjwt.token != undefined) {
                console.log("DB 결과 업데이트 시도");
                const result = await marketModel.updateOne(
                    { _id: productId },
                    {
                        $set: {
                            buyer: decodedjwt.userid,
                            priceLast: bidprice,
                        },
                    },
                    { upsert: true }
                );

                console.log("데이터 업데이트 실행 결과", result);
                res.send({ msg: "입찰 성공" });
            } else {
                res.render("login");
            }
        } catch (err) {
            console.error("경매 입찰 중 에러", err);
            res.status(500).send({ msg: "서버 오류" });
        }
    }
};
