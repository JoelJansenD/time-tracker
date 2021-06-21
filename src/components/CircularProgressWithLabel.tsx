import { Box, CircularProgress, CircularProgressProps, Typography, TypographyProps } from "@material-ui/core";

const CircularProgressWithLabel = (props: CircularProgressProps & { label: string, labelSize: number }) => {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" {...props} />
            <Box
                top={0}
                left={0}
                right={0}
                bottom={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <Typography variant="caption" component="div" color="textSecondary" style={{ fontSize: props.labelSize }}>{props.label}</Typography>
            </Box>
        </Box>
    );
}

export default CircularProgressWithLabel;