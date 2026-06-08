const HTMLRegisterEmail = (randomCode) => {
    return `
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Cuenta</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial, Helvetica, sans-serif;
">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0"
                    style="
                        max-width:600px;
                        background:#ffffff;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 4px 20px rgba(0,0,0,.08);
                    ">

                    <!-- HEADER -->
                    <tr>
                        <td align="center"
                            style="
                                background:#000000;
                                padding:40px 20px;
                            ">
                            <img
                                src="https://res.cloudinary.com/dwco4jlia/image/upload/v1780709318/e188f8e3-49fc-4d45-bed3-d38bcbd0a258_pzojey.jpg"
                                alt="LØØM & WEFT"
                                style="
                                    width:180px;
                                    max-width:100%;
                                    display:block;
                                ">
                        </td>
                    </tr>

                    <!-- CONTENT -->
                    <tr>
                        <td style="padding:40px 35px; text-align:center;">

                            <h1 style="
                                margin:0;
                                color:#111111;
                                font-size:30px;
                                font-weight:800;
                                letter-spacing:1px;
                            ">
                                Verifica tu cuenta
                            </h1>

                            <p style="
                                margin:20px 0 30px;
                                color:#555555;
                                font-size:15px;
                                line-height:1.7;
                            ">
                                Bienvenido a <strong>LØØM & WEFT</strong>.
                                Utiliza el siguiente código para completar
                                el registro y acceder a nuestras colecciones.
                            </p>

                            <!-- CODE -->
                            <div style="
                                background:#111111;
                                color:#ffffff;
                                display:inline-block;
                                padding:18px 35px;
                                border-radius:10px;
                                font-size:32px;
                                font-weight:bold;
                                letter-spacing:10px;
                                font-family:monospace;
                            ">
                                ${randomCode}
                            </div>

                            <p style="
                                margin-top:30px;
                                color:#777777;
                                font-size:14px;
                                line-height:1.6;
                            ">
                                Este código expirará en 15 minutos.
                            </p>

                        </td>
                    </tr>

                    <!-- BANNER -->
                    <tr>
                        <td style="
                            background:#000000;
                            color:#ffffff;
                            text-align:center;
                            padding:25px;
                        ">
                            <h3 style="
                                margin:0 0 10px;
                                font-size:18px;
                                letter-spacing:2px;
                            ">
                                STREETWEAR • URBAN STYLE
                            </h3>

                            <p style="
                                margin:0;
                                color:#cfcfcf;
                                font-size:13px;
                            ">
                                Redefiniendo el estilo urbano desde 2025
                            </p>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="
                            padding:25px;
                            text-align:center;
                            font-size:12px;
                            color:#888888;
                            border-top:1px solid #eaeaea;
                        ">
                            Si no solicitaste este correo,
                            puedes ignorarlo de forma segura.
                            <br><br>
                            © 2025 LØØM & WEFT. Todos los derechos reservados.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
`;
};

export default HTMLRegisterEmail;