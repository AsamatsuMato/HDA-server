const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/index");

const UserModel = require("../model/User");

const AlipaySdk = require("alipay-sdk").default;

router.post("/authorizedAccessToken", async (req, res) => {
  const alipaySdk = new AlipaySdk({
    // 小程序 appId
    appId: "2021004136677227",
    // 小程序应用私钥
    privateKey:
      "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCCNWXi82GZk7Pis1ZexxV3YtC5m1+z6dAOgQruREUOn3JJXJS5PnoOZYOS5jnhutQKQ6mowuxMRgdnJxPxbRRkuBXlfd28S+mPu76FH4u/jNQT2hPNG2ZEgRVdLHC+VNu8My7wLgt6y/jHd6IDNgEEDuFJy6zE4Si8L8zzrVSvV+LJUxfGdUbJ+qaq6OkVj0vhtRQGhqLXDwoXPWcuo/lRbGWpvorA2JFAMo8bv1XVpXoxdVMBMW2nup86ZXBkpFpY1N+fg73S2PZpmz29PRyOEQE9F6ALPZjEPY0uE9RMH/tsFe3HOeKtc8P7tjIDE/gkQ6DXwp9DOfjnNTQXz5KRAgMBAAECggEAEot0ZWxwfCUTO7h7FqiYIBbMz4KXkNI+NbKfUewbQcfnyRcMf42saJyArs1ndQTc6lFUupp4eSyIJWLlbj8w5l9pjvPsPsM5EqWUrvUdPDzcf69RnqbGW/9egZSwwgrn+Nf5WW/VZrniRtZ9FqP8ZQ2RfKcrhibjXFoagKIxK3/OsDKGOmLoMGnnaXQ7rTI9Cm+6eVGZjEYfsitN11pGDvaWIS4itVNDM0zZCq6H1U4nmN1lVSp9t+GzUkdtM9FZYf7pXv/FDRaAaizJ6LaQpfwktfbabTxVv4M9ocsbGpDdQPF53txNh+yiBHGo20G+uuyMjIdDj7r3U+IWeLXw+QKBgQDHo0PsyMX2byOqILv9+Vy5z/NFztJYxD5ZD/kW+z3yuEqIhihjhfWok7Z2B0ZExQgJvtEPIIdiaWB0ZSrctBncBycHaDwgodBoXKDJ8WBZETWmJoHtscsnHHw2wYSNNJSf2Oah4o/Q6rlqpFN9rszr6jPai7CFBYP/JozO+PzYgwKBgQCm+CsvrvB2t0PR77fwuIgUi/Lt1tTZMGPdEUcOP8rOqzdWGMXu9yS35NFUm867t8DLeejvm43TOmsxlJdZEn5kjlazP0/XM+XmutR92R+zutG8x2N+yPFY67D1vouF6G0jdyJ+S0o65POsFdhGKKcYmvPCUXOTACargjItM/w0WwKBgEaPCsPWljkqQMWxeiAikUZPHCFRHwEmow6hWZ1owRVXU2h7Wi0KvK+PPY7rtUc7CENBgOxCx/bdXazl0MdelEEy+fVhPtcdueYYzu9w82encHm/5G4ZR78UD0bfELVDnz/7zk/rHn9tZokteSDTtjOvfBJDCumI8IUun9fLIrp3AoGAKKA1kdKU+623uLsFHHMp2SX8I9ajz3ywr7dmfJcU95g9TJuWfYBw1LW+IUIP2Sjqphexj6tfpMeQEW5ALRIM4tanTdHX0Vr1U2CeF0jfJ9IK+k3hbZXi82nVktWcCSb2dyyjnesf0pimmXZvOxLlJV1+dgdvgZMF1bFGGC2P7gUCgYBGsQKcaivtMBUhfqoNHIMMA7Iltuf7XHXlu/76PbRWB3qbqY1KlWGkh6DOhhj2BApHQuP0BLShkZf6XUuskmA0DipNs3dpjI0fJYBR6wsL4LEsHNJOKdkVHOyTqIjXlymUJk5OSZTsm7M9JiMXXzqgvISkTcybWaTpzIROs1WAQw==",
    // 支付宝公钥
    alipayPublicKey:
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgjVl4vNhmZOz4rNWXscVd2LQuZtfs+nQDoEK7kRFDp9ySVyUuT56DmWDkuY54brUCkOpqMLsTEYHZycT8W0UZLgV5X3dvEvpj7u+hR+Lv4zUE9oTzRtmRIEVXSxwvlTbvDMu8C4Lesv4x3eiAzYBBA7hScusxOEovC/M861Ur1fiyVMXxnVGyfqmqujpFY9L4bUUBoai1w8KFz1nLqP5UWxlqb6KwNiRQDKPG79V1aV6MXVTATFtp7qfOmVwZKRaWNTfn4O90tj2aZs9vT0cjhEBPRegCz2YxD2NLhPUTB/7bBXtxznirXPD+7YyAxP4JEOg18KfQzn45zU0F8+SkQIDAQAB",
    gateway: "https://openapi.alipay.com/gateway.do",
  });

  const { authStart, accessToken } = await alipaySdk.exec(
    "alipay.system.oauth.token",
    {
      code: req.body.authCode,
      grant_type: "authorization_code",
    }
  );
  const { avatar, nickName, openId } = await alipaySdk.exec(
    "alipay.user.info.share",
    {
      authToken: accessToken,
    }
  );

  const user = await UserModel.find({ openId });
  if (user.length !== 0) {
    await UserModel.updateOne(
      { openId },
      { avatar, nickName, lastLoginTime: authStart }
    );
  } else {
    await UserModel.create({
      openId,
      avatar,
      nickName,
      lastLoginTime: authStart,
    });
  }

  const token = jwt.sign(
    {
      openId,
      avatar,
      nickName,
    },
    SECRET,
    {
      expiresIn: 60 * 60 * 24 * 7, // 设置 token 有效期为 7 天（数字单位为秒）
    }
  );

  res.json({
    code: 200,
    data: {
      token,
      avatar,
      nickName,
    },
    msg: "登录成功",
  });
});

module.exports = router;
