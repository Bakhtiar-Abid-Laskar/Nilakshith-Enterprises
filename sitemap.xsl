<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>XML Sitemap — Nilakshith Enterprise</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet" />
        <style>
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #F7F8FA;
            color: #111827;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
            padding: 32px;
          }
          header {
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 24px;
            margin-bottom: 24px;
          }
          h1 {
            font-size: 28px;
            color: #1A4FBF;
            margin: 0 0 8px 0;
            font-weight: 700;
          }
          .tagline {
            color: #4B5563;
            font-size: 14px;
            margin: 0;
          }
          .info-box {
            background-color: #EBF0FB;
            border: 1px solid #C5D3F5;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
            font-size: 14px;
            color: #1540A0;
            line-height: 1.5;
          }
          .info-box a {
            color: #1A4FBF;
            font-weight: 600;
            text-decoration: none;
          }
          .info-box a:hover {
            text-decoration: underline;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #4B5563;
            background-color: #F7F8FA;
            padding: 12px 16px;
            font-weight: 600;
            border-bottom: 2px solid #E5E7EB;
          }
          td {
            padding: 16px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 14px;
          }
          tr:hover td {
            background-color: #F9FAFB;
          }
          .url-link {
            color: #1A4FBF;
            font-weight: 500;
            text-decoration: none;
          }
          .url-link:hover {
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 9999px;
          }
          .badge-priority {
            background-color: #EBF0FB;
            color: #1A4FBF;
          }
          .badge-freq {
            background-color: #F3F4F6;
            color: #374151;
          }
          footer {
            margin-top: 32px;
            text-align: center;
            font-size: 12px;
            color: #9CA3AF;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Nilakshith Enterprise</h1>
            <p class="tagline">XML Sitemap for Search Engine Optimization (SEO)</p>
          </header>
          
          <div class="info-box">
            This is an XML Sitemap generated to help search engines like Google and Bing discover and index the pages on <a href="https://nilakshithenterprise.in/">https://nilakshithenterprise.in/</a>. 
            There are <strong><xsl:value-of select="count(s:urlset/s:url)"/></strong> pages listed below.
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL Location</th>
                <th style="width: 15%;">Last Modified</th>
                <th style="width: 15%;">Change Frequency</th>
                <th style="width: 15%;">Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td>
                    <a class="url-link" href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                  </td>
                  <td>
                    <xsl:value-of select="s:lastmod"/>
                  </td>
                  <td>
                    <span class="badge badge-freq"><xsl:value-of select="s:changefreq"/></span>
                  </td>
                  <td>
                    <span class="badge badge-priority"><xsl:value-of select="s:priority"/></span>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <footer>
            &copy; 2026 Nilakshith Enterprise. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
